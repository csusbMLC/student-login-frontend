import { Button, Title, Text, Stack } from "@mantine/core";
import { classTotalTime } from "@src/utilities/student";
import { secondsToHoursMinutesSeconds } from "@src/utilities/time";
import { useLoaderData } from "react-router-dom";

const Logout = () => {
  const { loginTimestamps, lastClass } = useLoaderData();

  return (
    <Stack>
      <Title>Thank you for visiting!</Title>
      <Text fw={500}>
        Total Time for{" "}
        {lastClass +
          ": " +
          secondsToHoursMinutesSeconds(
            classTotalTime(loginTimestamps, lastClass)
          )}
      </Text>
      <Text>You have been securely signed off</Text>
      <Button onClick={() => location.assign("/")}>Login</Button>
    </Stack>
  );
};

export default Logout;
