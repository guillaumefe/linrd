// A mock function to mimic making an async request for data
export function save(value = "") {
  return new Promise((resolve) => {
      setTimeout(() => resolve(localStorage.set("pl", value)), 500)
  })
}
