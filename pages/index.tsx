import { useState, ChangeEvent, FormEvent } from "react";
import styles from "../styles/emailSubmit.module.css";

const EmailSubmit: React.FC = () => {
  const [email, setEmail] = useState<string>(""); // State for email input
  const [errorMessage, setErrorMessage] = useState<string>(""); // State for error message
  const [successMessage, setSuccessMessage] = useState<string>(""); // State for success message
  const [canSubmit, setCanSubmit] = useState<boolean>(false); // State for button enable/disable
  const [submissionState, setSubmissionState] = useState<"PRESUBMIT" | "LOADING" | "SUCCESS" | "ERROR">("PRESUBMIT"); // Submission state

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    if (emailRegex.test(newEmail)) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      setSuccessMessage(""); // Clear success message if any
      setSubmissionState("ERROR");
      return;
    }

    setSubmissionState("LOADING"); // Set loading state

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
        setSuccessMessage(result.message);
        setErrorMessage(""); // Clear error message if any
        setSubmissionState("SUCCESS");
      } else {
        setErrorMessage(result.message || "Something went wrong.");
        setSuccessMessage(""); // Clear success message if any
        setSubmissionState("ERROR");
      }
    } catch (error) {
      console.error("Error submitting email:", error);
      setErrorMessage("Failed to submit email. Please try again.");
      setSuccessMessage(""); // Clear success message if any
      setSubmissionState("ERROR");
    }
  };

  return (
    <div className={styles.container}>

      {submissionState === "PRESUBMIT" && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <h1 className={styles.tapIn}>Welcome to Clover</h1>
          <input
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={handleChange}
            className={styles.input}
          />
          <button type="submit" className={styles.button} disabled={!canSubmit}>
            Submit
          </button>
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        </form>
      )}
      {submissionState === "LOADING" && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
        </div>
      )}
      {submissionState === "SUCCESS" && <p className={styles.success}>{successMessage}</p>}
      {submissionState === "ERROR" && <h1 className={styles.submissionError}>{errorMessage}</h1>}
    </div>
  );
};

export default EmailSubmit;