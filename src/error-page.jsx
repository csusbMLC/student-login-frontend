import { Box, Text, Title, Blockquote, Button } from "@mantine/core";
import { useNavigate, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  console.error(error);

  return (
    <Box id="error-page">
      <Title order={1}>Oops!</Title>
      <Text>Sorry, an unexpected error has occurred.</Text>
      <Blockquote color="red" cite="- Error Team">
        {error.statusText || error.message}
      </Blockquote>
      <Button onClick={() => navigate("/")}>Return to Login</Button>
    </Box>
  );
}
