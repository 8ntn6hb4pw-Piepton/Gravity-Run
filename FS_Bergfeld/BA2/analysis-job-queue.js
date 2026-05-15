/*
  Tiny local analysis queue for Beobachtungsassistent Tiefenstruktur.
  It keeps heavy-ish follow-up analysis out of the live typing path.
*/
(function attachAnalysisJobQueue(root) {
  class AnalysisJobQueue {
    constructor(options = {}) {
      this.jobs = new Map();
      this.running = false;
      this.defaultDelay = Number(options.defaultDelay ?? 0);
      this.budgetMs = Number(options.budgetMs ?? 10);
    }

    enqueue(id, task, options = {}) {
      if (!id || typeof task !== "function") {
        return;
      }
      const delay = Number(options.delay ?? this.defaultDelay);
      this.jobs.set(id, {
        id,
        task,
        dueAt: Date.now() + Math.max(0, delay),
        createdAt: Date.now()
      });
      this.schedule();
    }

    cancel(id) {
      this.jobs.delete(id);
    }

    schedule() {
      if (this.running) {
        return;
      }
      this.running = true;
      const runner = (deadline) => this.flush(deadline);
      if (typeof root.requestIdleCallback === "function") {
        root.requestIdleCallback(runner, { timeout: 220 });
      } else {
        root.setTimeout(() => runner(null), 24);
      }
    }

    flush(deadline) {
      const started = Date.now();
      const now = Date.now();
      const dueJobs = [...this.jobs.values()]
        .filter((job) => job.dueAt <= now)
        .sort((a, b) => a.dueAt - b.dueAt || a.createdAt - b.createdAt);

      for (const job of dueJobs) {
        if (deadline?.timeRemaining && deadline.timeRemaining() < 3) {
          break;
        }
        if (!deadline && Date.now() - started > this.budgetMs) {
          break;
        }
        this.jobs.delete(job.id);
        try {
          job.task();
        } catch (error) {
          console.error("Analyse-Job fehlgeschlagen", error);
        }
      }

      this.running = false;
      if (this.jobs.size) {
        const nextDue = Math.min(...[...this.jobs.values()].map((job) => job.dueAt));
        const wait = Math.max(0, Math.min(120, nextDue - Date.now()));
        root.setTimeout(() => this.schedule(), wait);
      }
    }
  }

  root.AnalysisJobQueue = AnalysisJobQueue;
  root.analysisJobQueue = root.analysisJobQueue ?? new AnalysisJobQueue({ budgetMs: 8 });
})(typeof window !== "undefined" ? window : globalThis);
