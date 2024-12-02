from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_
from database import get_db
from models.tree_model import Tree
from pydantic import BaseModel

router = APIRouter()

class TreeCreate(BaseModel):
    name: str
    description: str | None = None
    latitude: float
    longitude: float

@router.get("/")
def get_trees(db: Session = Depends(get_db)):
    return db.query(Tree).all()

@router.post("/")
def create_tree(tree: TreeCreate, db: Session = Depends(get_db)):
    db_tree = db.query(Tree).filter(and_(Tree.latitude == tree.latitude, Tree.longitude == tree.longitude)).first()
    if db_tree:
        raise HTTPException(status_code=404, detail="Tree already exists")
    db_tree = Tree(**tree.dict())
    db.add(db_tree)
    db.commit()
    db.refresh(db_tree)
    return db_tree

@router.delete("/{tree_id}")
def delete_tree(tree_id: int, db: Session = Depends(get_db)):
    db_tree = db.query(Tree).filter(Tree.id == tree_id).first()
    if not db_tree:
        raise HTTPException(status_code=404, detail="Tree not found")
    db.delete(db_tree)
    db.commit()
    return {"message": "Tree deleted successfully"}