const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
// Configuração da conexão com o MariaDB
const connection = mysql.createConnection({
host: "localhost",
user: "root", // ajuste se tiver usuário diferente
password: "root", // coloque a senha, se tiver
database: "tarefas_db",
port: 3306 // portas padrão do MariaDB
});
// Testar conexão
connection.connect(err => {
if (err) {
console.error("Erro ao conectar no banco:", err);
return;
}
console.log("Conectado ao MariaDB!");
});
// ======================
// ROTAS
// ======================
// GET: Listar todas as tarefas
app.get("/tarefas", (req, res) => {
const sql = "SELECT * FROM tarefas";
connection.query(sql, (err, results) => {
if (err) {
console.error("Erro ao buscar tarefas:", err);
return res.status(500).json({ erro: "Erro ao buscar tarefas" });
}
res.json(results);
});
});
// POST: Adicionar nova tarefa
app.post("/tarefas", (req, res) => {
const { titulo, descricao, status } = req.body;
const sql = "INSERT INTO tarefas (titulo, descricao, status) VALUES (?, ?, ?)";
connection.query(sql, [titulo, descricao, status || "pendente"], (err, result) => {
if (err) {
console.error("Erro ao adicionar tarefa:", err);
return res.status(500).json({ erro: "Erro ao adicionar tarefa" });
}
res.status(201).json({
id: result.insertId,
titulo,
descricao,
status: status || "pendente"
});
});
});

// PATCH: Atualizar status da tarefa
app.patch("/tarefas/:id", (req, res) => {
const { id } = req.params;
const { status } = req.body;
const sql = "UPDATE tarefas SET status = ? WHERE id = ?";
connection.query(sql, [status, id], (err, result) => {
if (err) {
console.error("Erro ao atualizar tarefa:", err);
return res.status(500).json({ erro: "Erro ao atualizar tarefa" });
}
if (result.affectedRows === 0) {
return res.status(404).json({ erro: "Tarefa não encontrada" });
}
res.json({ id, status });
});
});
// DELETE: Remover tarefa pelo ID
app.delete("/tarefas/:id", (req, res) => {
const { id } = req.params;
const sql = "DELETE FROM tarefas WHERE id = ?";
connection.query(sql, [id], (err, result) => {
if (err) {
console.error("Erro ao deletar tarefa:", err);
return res.status(500).json({ erro: "Erro ao deletar tarefa" });
}
if (result.affectedRows === 0) {
return res.status(404).json({ erro: "Tarefa não encontrada" });
}
res.json({ mensagem: "Tarefa excluída com sucesso", id });
});
});
// Servidor rodando
app.listen(port, () => {
console.log(`Servidor rodando em http://localhost:${port}`);
});