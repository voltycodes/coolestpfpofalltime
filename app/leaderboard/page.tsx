import Layout from "@/components/layout";
import ProfileCard from "@/components/ProfileCard";

import { prisma } from "@/lib/prisma";

export default async function Leaderboard() {
  const users = await prisma.user.findMany({
    orderBy: {
      votes: {
        _count: 'desc'
      }
    },
    take: 10,
    include: {
      votes: true,
      profilePicture: true
    }
  });

  console.log(users);
  
  return (
    <Layout>
      <h1 className="text-3xl my-6 mb-12 text-center">Leaderboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {users && users.map((user, rank) => (
          <ProfileCard key={user.id} user={user} rank={rank} />
        ))}
      </div>
    </Layout>
  );
}