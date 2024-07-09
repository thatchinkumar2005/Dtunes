import React, { useEffect } from "react";
import useGetAlbums from "../../Albums/hooks/useGetAlbums";
import Spinner from "../../../ui/components/Spinner";
import AlbumCard from "../../Albums/components/AlbumCard";

import { useInView } from "react-intersection-observer";

export default function AlbumsHomePage() {
  const {
    albums,
    error,
    isError,
    isPending,
    isSuccess,
    fetchNextPage,
    hasNextPage,
  } = useGetAlbums();

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  });
  return (
    <div className="h-48 md:h-64 w-full bg-primary rounded-lg p-3 disable-scrollbars grid grid-cols-3 md:grid-cols-4 gap-y-2 overflow-scroll">
      {isError && <div>{error}</div>}
      {isPending && <Spinner />}
      {isSuccess &&
        albums.pages.map((page) =>
          page.data.map((album) => (
            <div className="flex justify-center items-center">
              <AlbumCard key={album._id} album={album} />
            </div>
          ))
        )}

      <div className="flex justify-center items-center">
        <div ref={ref}>{hasNextPage ? <Spinner /> : "That's all Albums"}</div>
      </div>
    </div>
  );
}
