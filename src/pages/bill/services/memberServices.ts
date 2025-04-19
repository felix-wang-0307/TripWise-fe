

export function findMemberById(members: IUser[], id: string): IUser | undefined {
  return members.find((member) => member.userId == id);
}

export function findUsernameById(members: IUser[], id: string): string {
  const member = members.find((member) => member.userId == id);
  return member ? member.username : "Unknown User";
}