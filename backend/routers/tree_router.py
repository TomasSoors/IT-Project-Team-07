from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from database import get_db
from models.tree_model import Tree
from pydantic import BaseModel

router = APIRouter()

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
    return db.query(Tree).all()

@router.post("/trees")
def create_tree(tree: TreeCreate, db: Session = Depends(get_db)):
    radius = 0.0001
    db_tree = db.query(Tree).filter(
        func.abs(Tree.latitude - tree.latitude) < radius,
        func.abs(Tree.longitude - tree.longitude) < radius
    ).first()
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

@router.put("/trees/{tree_id}")
def update_tree(tree_id: int, tree: TreeUpdate, db: Session = Depends(get_db)):	
    db_tree = db.query(Tree).filter(Tree.id == tree_id).first()
    if not db_tree:
        raise HTTPException(status_code=404, detail="Tree not found")
    db_tree.height = tree.height
    db_tree.diameter = tree.diameter
    db.commit()
    db.refresh(db_tree)
    return db_tree