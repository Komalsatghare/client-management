import axios from "axios";
import { useLanguage } from "../../context/LanguageContext";

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");
  const [clients, setClients] = useState([]);

  // Fetch clients from backend
  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/clients");
      setClients(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Call fetchClients on component load
  useEffect(() => {
    fetchClients();
  }, []);

  // 🔹 This is the function you shared
  const handleAddClient = async () => {
    const newClient = { name, email, phone, company, notes, status: "Active" };
    try {
      await axios.post("http://localhost:5000/api/clients", newClient);
      fetchClients(); // refresh table
      // Clear form
      setName(""); setEmail(""); setPhone(""); setCompany(""); setNotes("");
      alert(t('client_added_success') || "Client added successfully!");
    } catch (err) {
      console.error(err);
      alert((t('error_adding_client') || "Error adding client") + ": " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div>
      <h2>{t('add_new_client') || "Add New Client"}</h2>
      <input placeholder={t('client_name') || "Name"} value={name} onChange={e => setName(e.target.value)} />
      <input placeholder={t('email') || "Email"} value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder={t('phone') || "Phone"} value={phone} onChange={e => setPhone(e.target.value)} />
      <input placeholder={t('company') || "Company"} value={company} onChange={e => setCompany(e.target.value)} />
      <input placeholder={t('notes') || "Notes"} value={notes} onChange={e => setNotes(e.target.value)} />
      <button onClick={handleAddClient}>{t('add_client_btn') || "Add Client"}</button>

      <h3>{t('client_records') || "Client Records"}</h3>
      <ul>
        {clients.map(c => (
          <li key={c._id}>{c.name} - {c.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
