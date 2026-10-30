export function Footer() {
  return (
    <footer className="mt-12 bg-brown text-cream">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <h3 className="mb-3 text-lg font-bold">BookstoreApp</h3>
          <p className="text-sm text-cream/80">
            Ηλεκτρονικό βιβλιοπωλείο με βιβλία, μουσική, παιχνίδια και χαρτικά. Ένα εκπαιδευτικό
            project φτιαγμένο με Spring Boot και React.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-bold">Ποιοι είμαστε</h3>
          <ul className="space-y-1 text-sm text-cream/80">
            <li>Η ιστορία μας</li>
            <li>Όροι χρήσης</li>
            <li>Πολιτική απορρήτου</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-bold">Επικοινωνία</h3>
          <ul className="space-y-1 text-sm text-cream/80">
            <li>info@bookstoreapp.example</li>
            <li>Δευτέρα – Παρασκευή, 09:00 – 17:00</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/20 py-4 text-center text-xs text-cream/70">
        © {new Date().getFullYear()} BookstoreApp
      </div>
    </footer>
  )
}