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
  generateDependencyReport,
} from "@discordjs/voice";
import { bgWhite, gray, italic } from "colorette";
import { client } from "..";

export default class GuildVoiceManager {
  readonly guildId: string;
  readonly abortController = new AbortController();
  player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Play,
    },
  });

  volume = 1;

  private static readonly guildVoiceManagers = new Map<
    string,
    GuildVoiceManager
  >();

  private currentResource?: AudioResource;

  public static get(guildId: string) {
    return GuildVoiceManager.guildVoiceManagers.get(guildId);
  }

  public static exists(guildId: string) {
    return GuildVoiceManager.guildVoiceManagers.has(guildId);
  }

  constructor(guildId: string) {
    this.guildId = guildId;
    if (GuildVoiceManager.exists(guildId))
      return GuildVoiceManager.get(guildId)!;
    GuildVoiceManager.guildVoiceManagers.set(guildId, this);
    const guildName = client.guilds.cache.get(guildId)?.name;
    console.log(
      gray(
        `Created a guild voice manager for guild ${italic(
          guildName || "unknown",
        )} (${guildId})`,
      ),
    );
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
    connection.subscribe(this.player);
    connection.on(VoiceConnectionStatus.Disconnected, async () => {
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
    });
    return connection;
  }
  play(resource: AudioResource) {
    const connection = getVoiceConnection(this.guildId);
    if (!connection) return false;
    if (resource.metadata) console.log(resource.metadata);
    this.player.play(resource);
    this.currentResource = resource;
    resource.playStream.on("end", () => {
      this.currentResource = undefined;
    });
    resource.playStream.on("close", () => {
      this.currentResource = undefined;
    });
  }
  pause() {
    return this.player.pause();
  }
  unpause() {
    return this.player.unpause();
  }
  stop() {
    this.player.stop();
  }
  leave() {
    this.voiceConnection?.disconnect();
    this.voiceConnection?.destroy();
  }
}

export const voiceHandler: Handler = async () => {
  console.log(
    bgWhite("Voice dependency report\n") + gray(generateDependencyReport()),
  );
};
