import { useState } from "react";
import { PasswordInput, Button, Group, Box } from "@mantine/core";
import axios from "axios";

function ChangePassword({ onCancel }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Basic validation
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      // Replace with your backend endpoint
      const response = await axios.post("/api/change-password", {
        currentPassword,
        newPassword,
      });

      if (response.data.success) {
        setSuccess("Password changed successfully");
        setError("");
      } else {
        setError("Failed to change password");
        setSuccess("");
      }
    } catch (err) {
      setError("Error changing password");
      setSuccess("");
    }
  };

  return (
    <Box style={{ maxWidth: "300px" }} mx="auto">
      <form onSubmit={handleChangePassword}>
        <PasswordInput
          label="Current Password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.currentTarget.value)}
          required
        />
        <PasswordInput
          label="New Password"
          placeholder="New Password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.currentTarget.value)}
          required
        />
        <PasswordInput
          label="Confirm New Password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.currentTarget.value)}
          required
        />
        {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
        {success && (
          <div style={{ color: "green", marginTop: 10 }}>{success}</div>
        )}
        <Group justify={"start"} mt={"md"}>
          <Button type="submit" className="btn-std">
            Update
          </Button>
          <Button
            variant="light"
            type="button"
            onClick={() => onCancel()}
            className="btn-std"
          >
            Cancel
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export default ChangePassword;
