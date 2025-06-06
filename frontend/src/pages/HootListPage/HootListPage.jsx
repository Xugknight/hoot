import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import * as hootService from '../../services/hootService';

export default function HootListPage() {
  const [hoots, setHoots] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const hoots = await hootService.index();
      setHoots(hoots);
    }
    fetchPosts();
  }, []);

  return (
    <main>
      {hoots.length ? (
        hoots.map((hoot) => (
          <Link key={hoot._id} to={`/hoots/${hoot._id}`}>
            <article>
              <header>
                <h2>{hoot.title}</h2>
                <p>
                  {`${hoot.author.name} posted on
                  ${new Date(hoot.createdAt).toLocaleDateString()}`}
                </p>
              </header>
              <p>{hoot.text}</p>
            </article>
          </Link>
        ))
      ) : (
        <p>No Hoots Yet!</p>
      )}
    </main>
  );
}