import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  const baseUrl = req.protocol + "://" + req.get("host");

  res.setHeader("Content-Type", "text/html");
  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Explorador de Personajes</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: #0a1628;
      color: #e8f4fd;
    }
    header {
      background: #0d1f3c;
      padding: 1rem;
      text-align: center;
    }
    h1 {
      margin: 0;
      color: #4fc3f7;
    }
    .contenedor {
      display: flex;
      height: calc(100vh - 70px);
    }
    .panel-izq {
      width: 300px;
      padding: 1rem;
