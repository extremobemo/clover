import { useState, ChangeEvent, FormEvent } from "react";
import styles from "../styles/emailSubmit.module.css"; 

const EmailSubmit: React.FC = () => {
  const [email, setEmail] = useState<string>(""); // State for email input
  const [errorMessage, setErrorMessage] = useState<string>(""); // State for error message
  const [successMessage, setSuccessMessage] = useState<string>(""); // State for success message

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      setSuccessMessage(""); // Clear success message if any
      return;
    }

    try {
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: email }), // Send email to the API
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage("Email submitted successfully!");
        setErrorMessage(""); // Clear error message if any
        setEmail(""); // Clear the input field
      } else {
        setErrorMessage(result.message || "Something went wrong.");
        setSuccessMessage(""); // Clear success message if any
      }
    } catch (error) {
      console.error("Error submitting email:", error);
      setErrorMessage("Failed to submit email. Please try again.");
      setSuccessMessage(""); // Clear success message if any
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Enter your email"
          value={email}
          onChange={handleChange}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Submit
        </button>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
      </form>
    </div>
  );
};

export default EmailSubmit;