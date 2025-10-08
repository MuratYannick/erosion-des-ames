import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import PrimaryButton from "../components/ui/PrimaryButton";
import CloseButton from "../components/ui/CloseButton";
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
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

    // Validation identifiant (pseudo ou email)
    if (!formData.identifier) {
      newErrors.identifier = "Le pseudo ou l'email est requis";
    }

    // Validation mot de passe
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
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
      await login(formData.identifier, formData.password);
      navigate("/");
    } catch (err) {
      console.error("Erreur de connexion:", err);
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

        <Card.Title>Connexion</Card.Title>

        {serverError && (
          <div className="bg-blood-900 border border-blood-700 text-blood-300 px-4 py-3 rounded mb-4 font-texte-corps">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <InputField
            label="Pseudo ou Email"
            type="text"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            placeholder="Votre pseudo ou email"
            required
            error={errors.identifier}
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

          <PrimaryButton
            type="submit"
            disabled={loading}
            className="w-full text-lg mt-6"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </PrimaryButton>
        </form>

        <p className="text-city-300 font-texte-corps text-sm text-center mt-6">
          Pas encore de compte ?{" "}
          <a
            href="/register"
            className="text-ochre-400 hover:text-blood-700 transition-colors duration-200"
          >
            S'inscrire
          </a>
        </p>
      </Card>
    </div>
  );
}

export default LoginPage;
