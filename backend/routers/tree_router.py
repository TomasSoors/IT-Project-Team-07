from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from database import get_db
from models.tree_model import Tree
from services.token_service import verify_token
from pydantic import BaseModel

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


class TreeCreate(BaseModel):
    name: str
    description: str | None = None
    latitude: float
    longitude: float


@router.get("/trees")
def get_trees(db: Session = Depends(get_db)):
    return db.query(Tree).all()


@router.post("/trees")
def create_tree(
    tree: TreeCreate,
    request: Request,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=401, detail="Missing or invalid Authorization header."
        )
    token = auth_header.split(" ")[1]
    verify_token(token=token, db=db)
    radius = 0.0001
    db_tree = (
        db.query(Tree)
        .filter(
            func.abs(Tree.latitude - tree.latitude) < radius,
            func.abs(Tree.longitude - tree.longitude) < radius,
        )
        .first()
    )
    if db_tree:
        raise HTTPException(status_code=404, detail="Tree already exists!")
    db_tree = Tree(**tree.dict())
    db.add(db_tree)
    db.commit()
    db.refresh(db_tree)
    return db_tree


@router.delete("/trees/{tree_id}")
def delete_tree(tree_id: int, db: Session = Depends(get_db)):
    db_tree = db.query(Tree).filter(Tree.id == tree_id).first()
    if not db_tree:
        raise HTTPException(status_code=404, detail="Tree not found")
    db.delete(db_tree)
    db.commit()
    return {"message": "Tree deleted successfully"}
