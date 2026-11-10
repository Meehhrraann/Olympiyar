// lib/storage.js  (client-side now)
const API = "/api/data";

async function request(url, options) {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
  });
  if (!res.ok) throw new Error((await res.json()).error || "Request failed");
  return res.json();
}

export const createId = (prefix = "OL") =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 7)
    .toUpperCase()}`;

export const storage = {
  // ----- Questions -----
  getQuestions: () => request(`${API}/questions`),

  async saveQuestion(question) {
    const item = {
      ...question,
      id: question.id?.trim() || createId("Q"),
      updatedAt: new Date().toISOString(),
    };

    // If it already has an id that exists, PUT; otherwise POST.
    // (A simple heuristic — you may want a dedicated "upsert" endpoint.)
    try {
      return await request(`${API}/questions/${item.id}`, {
        method: "PUT",
        body: JSON.stringify(item),
      });
    } catch {
      return await request(`${API}/questions`, {
        method: "POST",
        body: JSON.stringify(item),
      });
    }
  },

  deleteQuestion: (id) =>
    request(`${API}/questions/${id}`, { method: "DELETE" }),

  // ----- Exams -----
  getExams: () => request(`${API}/exams`),

  async saveExam(exam) {
    const item = {
      ...exam,
      id: exam.id || createId("EX"),
      createdAt: exam.createdAt || new Date().toISOString(),
    };
    try {
      return await request(`${API}/exams/${item.id}`, {
        method: "PUT",
        body: JSON.stringify(item),
      });
    } catch {
      return await request(`${API}/exams`, {
        method: "POST",
        body: JSON.stringify(item),
      });
    }
  },

  deleteExam: (id) => request(`${API}/exams/${id}`, { method: "DELETE" }),

  // ----- Reports -----
  getReports: () => request(`${API}/reports`),

  async saveReport(report) {
    const item = {
      ...report,
      id: createId("RP"),
      createdAt: new Date().toISOString(),
    };
    return request(`${API}/reports`, {
      method: "POST",
      body: JSON.stringify(item),
    });
  },

  deleteReport: (id) =>
    request(`${API}/reports/${id}`, { method: "DELETE" }),

  // Reset = clear all collections
  async reset() {
    const collections = ["questions", "exams", "reports"];
    await Promise.all(
      collections.map(async (c) => {
        const items = await request(`${API}/${c}`);
        await Promise.all(
          items.map((item) =>
            request(`${API}/${c}/${item.id}`, { method: "DELETE" })
          )
        );
      })
    );
  },
};