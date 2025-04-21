

export function findMemberById(members: IUser[], id: number): IUser | undefined {
  return members.find((member) => member.userId == id);
}

export function findUsernameById(members: IUser[], id: number): string {
  const member = members.find((member) => member.userId == id);
  return member ? member.username : "Unknown User";
}