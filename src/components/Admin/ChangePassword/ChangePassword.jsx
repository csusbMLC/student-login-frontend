import { useState } from "react";
import { PasswordInput, Button, Group, Box, Notification } from "@mantine/core";
import axios from "axios";
import { URL } from "@src/constants";

function ChangePassword({ onCancel, user }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Basic validation
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      // Replace with your backend endpoint
      const response = await axios.post(`${URL}/auth/changePassword`, {
        username: user,
        password: currentPassword,
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
    resetForm();
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
        <Group justify={"end"} mt={"md"}>
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
      {success && (
        <Notification mt={"md"} color={"green"} onClose={() => setSuccess("")}>
          {success}
        </Notification>
      )}
      {error && (
        <Notification mt={"md"} color={"red"} onClose={() => setError("")}>
          {error}
        </Notification>
      )}
    </Box>
  );
}

export default ChangePassword;
