"use client"

import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import styles from './IPTVPlayer.module.scss';
import { Input, Button, Skeleton } from "@/shared/ui";

type Channel = {
  id: string;
  name: string;
  country: string;
};

type Stream = {
  channel: string;
  url: string;
};

type SortType = "name" | "popularity";

//TODO: это прототип. нужно вынести на бек в отдельный микросервис
// с проверкой живой ли стрим и перебитием корсов

export const IPTVPlayer = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [channels, setChannels] = useState<Channel[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [filtered, setFiltered] = useState<Channel[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortType>("popularity");

  const [currentChannel, setCurrentChannel] = useState<string | null>(null);
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0);

  // загрузка
  useEffect(() => {
    async function load() {
      const [channelsRes, streamsRes] = await Promise.all([
        fetch("https://iptv-org.github.io/api/channels.json"),
        fetch("https://iptv-org.github.io/api/streams.json"),
      ]);

      const channelsData = await channelsRes.json();
      const streamsData = await streamsRes.json();

      setStreams(streamsData);

      const ruChannels = channelsData.filter(
        (ch: Channel) =>
          ch.country === "RU" &&
          streamsData.some((s: Stream) => s.channel === ch.id)
      );

      setChannels(ruChannels);
    }

    load();
  }, []);

  // получить стримы канала
  function getStreams(channelId: string) {
    return streams.filter((s) => s.channel === channelId);
  }

  // фильтр + сортировка
  useEffect(() => {
    let list = channels.filter((ch) =>
      ch.name.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sort === "popularity") {
      list.sort(
        (a, b) =>
          getStreams(b.id).length - getStreams(a.id).length
      );
    }

    setFiltered(list.slice(0, 100));
  }, [search, channels, sort]);

  function playStream(url: string) {
    if (!videoRef.current) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;

      hls.loadSource(url);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switchToNextStream();
        }
      });
    } else {
      videoRef.current.src = url;
    }
  }

  function switchToNextStream() {
    if (!currentChannel) return;

    const list = getStreams(currentChannel);

    if (currentStreamIndex + 1 < list.length) {
      const nextIndex = currentStreamIndex + 1;
      setCurrentStreamIndex(nextIndex);
      playStream(list[nextIndex].url);
    } else {
      console.warn("Все стримы умерли 💀");
    }
  }

  function playChannel(channelId: string) {
    const list = getStreams(channelId);
    if (!list.length) return;

    setCurrentChannel(channelId);
    setCurrentStreamIndex(0);
    playStream(list[0].url);
  }

  return (
    <div className={styles.container}>

      {/* Player */}
      <div className={styles.player}>
        {/* Не отображается, не видно этого */}
        {!currentChannel && (
          <div className={styles.empty}>
            Выбери канал
          </div>
        )}
  
        <video
          ref={videoRef}
          controls
          autoPlay
          className={styles.video}
        />
      </div>

      {/* Sidebar */}
      <div className={styles.sidebar}>
  
        <Input
          placeholder="Поиск каналов"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.search}
        />
  
        <div className={styles.sort}>
          <Button
            variant={sort === "popularity" ? "gray" : "default"}
            size="small"
            onClick={() => setSort("popularity")}
          >
            🔥 Популярные
          </Button>
  
          <Button
            variant={sort === "name" ? "gray" : "default"}
            size="small"
            onClick={() => setSort("name")}
          >
            A–Z
          </Button>
        </div>
  
        <div className={styles.list}>
          {!channels.length &&
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={styles.skeletonItem}>
                <Skeleton width={40} height={40} />
                <Skeleton width="60%" height={16} />
              </div>
            ))}
  
          {filtered.map((ch) => (
            <div
              key={ch.id}
              onClick={() => playChannel(ch.id)}
              className={`${styles.item} ${
                currentChannel === ch.id ? styles.active : ""
              }`}
            >
              <Skeleton width={40} height={40} />
  
              <div className={styles.meta}>
                <div className={styles.name}>{ch.name}</div>
                <div className={styles.sub}>
                  {getStreams(ch.id).length} стримов
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}