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
