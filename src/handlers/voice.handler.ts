//TODO: make this work once node:dgram is implemented

import { VoiceBasedChannel } from "discord.js";
import { Handler } from "./_handlers";
import {
  VoiceConnectionStatus,
  getVoiceConnection,
  joinVoiceChannel,
  entersState,
  createAudioPlayer,
  NoSubscriberBehavior,
  AudioResource,
  createAudioResource,
  StreamType,
} from "@discordjs/voice";
import { Readable } from "stream";

class GuildVoice {
  readonly guildId: string;
  readonly abortController = new AbortController();
  constructor(guildId: string) {
    this.guildId = guildId;
    if (guildVoices.has(guildId)) return guildVoices.get(guildId)!;
    guildVoices.set(guildId, this);
  }
  get voiceConnection() {
    return getVoiceConnection(this.guildId);
  }
  join(channel: VoiceBasedChannel) {
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guildId,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });
    connection.on(
      VoiceConnectionStatus.Disconnected,
      async (oldState, newState) => {
        try {
          await Promise.race([
            entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
            entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
          ]);
          // Seems to be reconnecting to a new channel - ignore disconnect
        } catch (error) {
          // Seems to be a real disconnect which SHOULDN'T be recovered from
          connection.destroy();
        }
      }
    );
    return connection;
  }
  leave() {
    this.voiceConnection?.disconnect();
    this.voiceConnection?.destroy();
  }
}

const guildVoices = new Map<string, GuildVoice>();

export const voiceHandler: Handler = async (client) => {};
