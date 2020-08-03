async function fetcher(url) {
  return await fetch(url).then((res) => {
    if (!res.ok) {
      throw Error(res.statusText);
    }
    return res.json();
  });
}

export default fetcher;
