/*
 * @Author: Chris
 * @Date: 2023-08-29 10:01:01
 * @LastEditors: Chris
 * @LastEditTime: 2023-08-30 15:09:51
 * @FilePath: \PagTest\src\components\animationPlayer\SvgaPlayer.tsx
 * @Description:
 *
 * Copyright (c) 2023 by aiyiyun, All Rights Reserved.
 */

import type { SvgaPlayerPropsType } from '@/types/animationPlayer';
import { Parser, Player } from 'svga';
import type { ParserConfigOptions } from 'svga/dist/types';
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';

export default defineComponent({
  name: 'SvgaPlayer',
  emits: ['ready'],
  props: {
    conf: {
      type: Object,
      require: true,
    },
  },

  setup(props, { emit }) {
    const svgaCanvas = ref<any>(null);
    let player: Player;
    let parser: Parser;

    const {
      url,
      width,
      height,
      loop = 0,
      useType = 1,
      fillMode = 'forwards',
      playMode = 'forwards',
      endFrame = 0,
      loopStartFrame = 0,
      startFrame = 0,
      isCacheFrames = true,
      isOpenNoExecutionDelay = true,
      isUseIntersectionObserver = true,
      onStartPlay,
      onEnded,
      onPlaying,
      onDestory,
    } = props.conf as SvgaPlayerPropsType;

    const lifeCycleEvent = (player: Player) => {
      player.onStart = () => {
        console.log('onStart');
        if (onStartPlay) onStartPlay(player);
      };
      player.onResume = () => {
        console.log('onResume');
      };
      player.onPause = () => {
        console.log('onPause');
      };
      player.onStop = () => {
        console.log('onStop');
      };
      player.onProcess = () => {
        if (onPlaying) onPlaying(player);

        console.log('onProcess', player);
      };
      player.onEnd = () => {
        console.log('onEnd');
        if (onEnded) onEnded(player);
      };
    };

    const laodResource = async (player: Player, parser: Parser, url: string) => {
      const svga = await parser.load(url);
      player.clear();
      await player.mount(svga);

      if (useType === 1) {
        // 开始播放动画
        player.start();
      } else {
        lifeCycleEvent(player);
        emit('ready', { player });
      }
    };

    const paginit = async () => {
      const ParserConf = {
        container: svgaCanvas.value,
        loop,
        fillMode,
        playMode,
        startFrame,
        endFrame,
        loopStartFrame,
        isCacheFrames,
        isUseIntersectionObserver,
        isOpenNoExecutionDelay,
      };
      parser = new Parser(ParserConf as ParserConfigOptions);
      player = new Player(svgaCanvas.value);
      laodResource(player, parser, url);
      // 暂停播放动画
      // player.pause()

      // 继续播放动画
      // player.resume()

      // 停止播放动画
      // player.stop()

      // 清空动画
      // player.clear()

      // 销毁
      // parser.destroy()
      // player.destroy()
    };

    watch(
      () => props.conf?.url,
      (value) => {
        laodResource(player, parser, value);
      }
    );

    onMounted(() => {
      paginit();
    });

    onUnmounted(() => {
      player?.destroy();
      parser?.destroy();
    });

    return () => (
      <canvas ref={svgaCanvas} width={width} height={height}>
        {' '}
      </canvas>
    );
  },
});
