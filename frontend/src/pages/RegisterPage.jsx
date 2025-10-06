import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import PrimaryButton from "../components/ui/PrimaryButton";
import CloseButton from "../components/ui/CloseButton";
import { useAuth } from "../contexts/AuthContext";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validation username
    if (!formData.username) {
      newErrors.username = "Le nom d'utilisateur est requis";
    } else if (formData.username.length < 3) {
      newErrors.username =
        "Le nom d'utilisateur doit contenir au moins 3 caractères";
    }

    // Validation email
    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    // Validation mot de passe
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    // Validation confirmation mot de passe
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Veuillez confirmer votre mot de passe";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await register(formData.username, formData.email, formData.password);
      navigate("/");
    } catch (err) {
      console.error("Erreur d'inscription:", err);
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <Card className="relative">
        <CloseButton onClick={handleClose} />

        <Card.Title>Inscription</Card.Title>

        {serverError && (
          <div className="bg-blood-900 border border-blood-700 text-blood-300 px-4 py-3 rounded mb-4 font-texte-corps">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <InputField
            label="Nom d'utilisateur"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Votre pseudo"
            required
            error={errors.username}
          />

          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="votre@email.com"
            required
            error={errors.email}
          />

          <InputField
            label="Mot de passe"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            error={errors.password}
          />

          <InputField
            label="Confirmer le mot de passe"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
            error={errors.confirmPassword}
          />

          <PrimaryButton
            type="submit"
            disabled={loading}
            className="w-full text-lg mt-6"
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </PrimaryButton>
        </form>

        <p className="text-city-300 font-texte-corps text-sm text-center mt-6">
          Déjà inscrit ?{" "}
          <a
            href="/login"
            className="text-ochre-400 hover:text-blood-700 transition-colors duration-200"
          >
            Se connecter
          </a>
        </p>
      </Card>
    </div>
  );
}

export default RegisterPage;
