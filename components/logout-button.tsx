'use client';

export default function LogoutButton(){
  return <form action="/api/auth/logout" method="post"><button className="btn" type="submit">Log out</button></form>;
}
