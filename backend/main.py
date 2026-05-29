from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import models
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PacienteSchema(BaseModel):
    nome: str
    cpf: str
    data_nascimento: str
    telefone: str

class PacienteUpdate(BaseModel):
    nome: Optional[str] = None
    cpf: Optional[str] = None
    data_nascimento: Optional[str] = None
    telefone: Optional[str] = None

@app.get("/pacientes")
def listar(db: Session = Depends(get_db)):
    return db.query(models.Paciente).all()

@app.post("/pacientes", status_code=201)
def criar(paciente: PacienteSchema, db: Session = Depends(get_db)):
    db_paciente = models.Paciente(**paciente.dict())
    db.add(db_paciente)
    db.commit()
    db.refresh(db_paciente)
    return db_paciente

@app.put("/pacientes/{id}")
def atualizar(id: int, paciente: PacienteUpdate, db: Session = Depends(get_db)):
    db_paciente = db.query(models.Paciente).filter(models.Paciente.id == id).first()
    if not db_paciente:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    for key, value in paciente.dict(exclude_unset=True).items():
        setattr(db_paciente, key, value)
    db.commit()
    db.refresh(db_paciente)
    return db_paciente

@app.delete("/pacientes/{id}")
def deletar(id: int, db: Session = Depends(get_db)):
    db_paciente = db.query(models.Paciente).filter(models.Paciente.id == id).first()
    if not db_paciente:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    db.delete(db_paciente)
    db.commit()
    return {"mensagem": "Paciente deletado com sucesso"}