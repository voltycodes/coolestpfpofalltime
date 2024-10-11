import Image from "next/image";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma"; 

export default async function Home() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  if (!isUserAuthenticated) {
    redirect("/login");
  }

  const user = await getUser();
  const username = user.given_name + " " + user.family_name; 
  console.log("Authenticated user:", user);
  console.log("User picture URL:", user.picture);

  try {
    // Check if the user already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { twitterId: user.id },
    });

    if (!existingUser) {
      console.log("Creating new user in the database");
     
      await prisma.user.create({
        data: {
          twitterId: user.id,
          username: username || "Default Username", 
          pfpUrl: user.picture, 
        },
      });
      console.log("User created successfully");
    } else {
      console.log("User already exists:", existingUser);
    }
  } catch (error) {
    console.error("Error creating user:", error);
  }

  return (
    <div>
      {user.picture && (
        <Image
          src={user.picture}
          alt={`${username}'s profile picture`}
          width={100}
          height={100}
        />
      )}
      <h1>Hey {username}, sup?</h1>
    </div>
  );
}
