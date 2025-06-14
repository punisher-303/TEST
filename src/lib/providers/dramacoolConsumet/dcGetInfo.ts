import axios from 'axios';
import {Info, Link} from '../types';
// import {getBaseUrl} from '../getBaseUrl';

export const dcGetInfo = async function (id: string): Promise<Info> {
  try {
    // const baseUrl = await getBaseUrl('consumet');
    const url = `https://consumet.8man.me/movies/dramacool/info?id=` + id;
    console.log('dcGetInfo', url);
    const res = await axios.get(url);
    const data = res.data;
    const meta = {
      title: data.title,
      synopsis: data.description.replace(/<[^>]*>?/gm, '').trim(),
      image: data.image,
      tags: [data?.releaseDate, ...data?.genres?.slice(0, 3)],
      imdbId: '',
      type: data.episodes.length > 1 ? 'series' : 'movie',
    };

    const links: Link['directLinks'] = [];
    data.episodes.forEach((episode: any) => {
      const title = 'Episode ' + episode.episode;
      const link = episode.id + '*' + data.id;
      if (link && title) {
        links.push({
          title,
          link,
        });
      }
    });

    return {
      ...meta,
      linkList: [
        {
          title: meta.title,
          directLinks: links,
        },
      ],
    };
  } catch (err) {
    console.error(err);
    return {
      title: '',
      synopsis: '',
      image: '',
      imdbId: '',
      type: 'movie',
      linkList: [],
    };
  }
};