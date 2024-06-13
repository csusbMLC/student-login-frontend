import { Button, Title, Text, Box } from "@mantine/core";
import { classTotalTime } from "@src/utilities/student";
import { secondsToHoursMinutesSeconds } from "@src/utilities/time";
import { useLoaderData } from "react-router-dom";

const Logout = () => {
  const { loginTimestamps, lastClass } = useLoaderData();

  return (
    <Box>
      <Title>Thank you for visiting!</Title>
      <Title>
        Total Time for{" "}
        {lastClass +
          " " +
          secondsToHoursMinutesSeconds(
            classTotalTime(loginTimestamps, lastClass)
          )}
      </Title>
      <Text></Text>
      <Text>You have been securely signed off</Text>
      <Button onClick={() => location.assign("/")}>Login</Button>
    </Box>
  );
};

export default Logout;
