/**
 * Renders the header component for the admin section.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.user - The username of the logged-in user.
 * @param {Function} props.handleLogout - The function to handle user logout.
 * @returns {JSX.Element} The rendered header component.
 */
import { Group, UnstyledButton, Title, Button } from "@mantine/core";

function Header({ user, handleLogout }) {
  return (
    <Group justify="space-between" mb={"xl"}>
      <UnstyledButton>{user}</UnstyledButton>
      <Title order={1}>MLC Admin Home</Title>
      <Button onClick={handleLogout}>{"Logout"}</Button>
    </Group>
  );
}

export default Header;
