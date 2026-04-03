"use client";
import Heading from "./utils/Heading";
import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [activeItem] = useState(0);
  const [route, setRoute] = useState("Login");
  return (
    <div>
      <Heading
        title="Tech Learning"
        description="Tech Learning is a platform for online learning and education."
        keywords="ETech Learning, online learning, education, courses, tutorials, training"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <Hero />
    </div>
  );
};

export default Page;
