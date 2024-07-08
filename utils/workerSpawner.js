const { Worker } = require("worker_threads");
const path = require("path");

exports.spawnWorker = (workerData) => {
  const worker = new Worker(path.resolve(__dirname, "./imageWorker.js"), {
    workerData,
  });

  worker.on("message", (message) => {
    if (message.status === "completed") {
      console.log(`Worker completed task for uniqueID: ${message.uniqueID}`);
    } else if (message.status === "error") {
      console.error("Worker encountered an error:", message.error);
    }
  });

  worker.on("error", (error) => {
    console.error("Worker error:", error);
  });

  worker.on("exit", (code) => {
    if (code !== 0) {
      console.error(`Worker stopped with exit code ${code}`);
    }
  });
};
