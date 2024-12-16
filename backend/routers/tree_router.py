from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer
from services.token_service import verify_token
from services.tree_service import create_tree, delete_tree, update_tree, get_all_trees
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

BEARER_PREFIX = "Bearer "
AUTH_ERROR = "Missing or invalid Authorization header."


class TreeCreate(BaseModel):
    name: str
    description: str | None = None
    latitude: float
    longitude: float


class TreeUpdate(BaseModel):
    height: float | None = None
    diameter: float | None = None


@router.get("/trees")
def get_trees(db: Session = Depends(get_db)):
    return get_all_trees(db)


@router.post("/trees")
def create_tree_route(
    tree: TreeCreate,
    request: Request,
    db: Session = Depends(get_db),
    token_param: str = Depends(oauth2_scheme),
):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith(BEARER_PREFIX):
        raise HTTPException(status_code=401, detail=AUTH_ERROR)
    token = auth_header[len(BEARER_PREFIX):]
    print(token)
    verify_token(token, db)
    return create_tree(tree, db)


@router.delete("/trees/{tree_id}")
def delete_tree_route(
    tree_id: int,
    request: Request,
    db: Session = Depends(get_db),
    token_param: str = Depends(oauth2_scheme),
):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith(BEARER_PREFIX):
        raise HTTPException(status_code=401, detail=AUTH_ERROR)
    token = auth_header[len(BEARER_PREFIX):]
    verify_token(token, db)
    return delete_tree(tree_id, db)


@router.put("/trees/{tree_id}")
def update_tree_route(
    tree_id: int,
    tree: TreeUpdate,
    request: Request,
    db: Session = Depends(get_db),
    token_param: str = Depends(oauth2_scheme),
):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith(BEARER_PREFIX):
        raise HTTPException(status_code=401, detail=AUTH_ERROR)
    token = auth_header[len(BEARER_PREFIX):]
    verify_token(token, db)
    return update_tree(tree_id, tree.height, tree.diameter, db)
