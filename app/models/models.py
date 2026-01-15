from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Cuidador(db.Model):
    __tablename__ = 'cuidadores'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    senha = db.Column(db.String(200), nullable=False)
    pacientes = db.relationship('Paciente', backref='cuidador', lazy=True)

class Paciente(db.Model):
    __tablename__ = 'pacientes'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    data_nasc = db.Column(db.Date, nullable=False)
    cuidador_id = db.Column(db.Integer, db.ForeignKey('cuidadores.id'))
    sexo = db.Column(db.String(10))
    cpf = db.Column(db.String(14))
    tel = db.Column(db.String(20))
    email = db.Column(db.String(120))
    estado_civil = db.Column(db.String(50))
    nome_mae = db.Column(db.String(255))
    nome_pai = db.Column(db.String(255))
    nacionalidade = db.Column(db.String(100))
    naturalidade = db.Column(db.String(100))
    contato_emergencia_nome = db.Column(db.String(255))
    contato_emergencia_telefone = db.Column(db.String(20))
    contato_emergencia_parentesco = db.Column(db.String(100))
    endereco = db.Column(db.String(255))
    cep = db.Column(db.String(10))
    tipo_sanguineo = db.Column(db.String(5))
    alergias = db.Column(db.String(255))
    doencas_cronicas = db.Column(db.String(255))
    medicamentos_em_uso = db.Column(db.String(255))