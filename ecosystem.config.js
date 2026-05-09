module.exports = {
  apps: [
    {
      name: "fin-api",
      script: "./venv/bin/python",
      args: "-m uvicorn main:app --port 8000",
      cwd: "./backend",
      watch: false,
      env: {
        PYTHONPATH: ".",
        PYTHONUNBUFFERED: "1"
      }
    },
    // {
    //   name: "frontend",
    //   script: "npm",
    //   args: "start",
    //   cwd: "./frontend",
    // }
  ]
}