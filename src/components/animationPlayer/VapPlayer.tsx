/*
 * @Author: Chris
 * @Date: 2023-08-29 10:01:01
 * @LastEditors: Chris
 * @LastEditTime: 2023-08-30 15:41:56
 * @FilePath: \PagTest\src\components\animationPlayer\VapPlayer.tsx
 * @Description: 
 * 
 * Copyright (c) 2023 by aiyiyun, All Rights Reserved. 
 */
// <template>
//     <div>
//         <div ref="anim" class="anim-container"></div>
//         <button :class="[!access && 'disable']" @click.stop="play(0)">play(无融合)</button>
//         <button :class="[!access && 'disable']" @click.stop="play(1)">play(有融合)</button>
//         <button v-if="vap" @click.stop="playContinue()">continue</button>
//         <button v-if="vap" @click.stop="pause()">pause</button>
//     </div>
// </template>

import type { VpaPlayerPropsType } from '@/types/animationPlayer';
import VapPlayer from 'video-animation-player';
import { defineComponent, onMounted, ref, onUnmounted } from 'vue';


export default defineComponent({
    name: 'VapPlayer',
    emits: ['ready'],
    props: {
        conf: {
            type: Object,
            require: true
        }
    },
    setup(props, { emit }) {
        let player: any = null;
        const targetDomRef = ref<any>(null)
        const access = ref(true)

        const {
            url: src,
            jsonConf: config,
            useType = 1,
            width = 400,
            height = 400,
            fps,
            loop = true,
            mute = true,
            beginPoint = 0,
            accurate = true,
            type = 0,
            imgUser,
            imgAnchor,
            textUser,
            textAnchor,
            precache = false,
            onStartPlay,
            onDestory,
            onEnded,
            onLoadError,
            onPlaying
        } = props.conf as VpaPlayerPropsType;



        const lifeCycleEvent = (player: any) => {

            player.on('canplay', () => {
                // console.log("素材已经准备好，可以播放了")
            })
            player.on('playing', () => {
                access.value = false
                console.log('playing')
                if (onStartPlay) onStartPlay(player)
            })
            player.on('ended', () => {
                access.value = true
                console.log('play ended')
                if (onEnded) onEnded(player)

            })
            player.on('frame', (frame: number) => {
                if (onPlaying) return onPlaying(player)
                // console.log('播放中')
                // frame: 当前帧(从0开始)  timestamp: (播放时间戳)
                // if (frame === 50) {
                // do something
                // }
                // console.log(frame, '-------', timestamp)
            })

            player.on('error', () => {
                console.log('播放出错了')
            })

            player.onLoadError = () => {
                if (onLoadError) onLoadError(player)
            }
        }



        const playerInit = () => {
            player = new VapPlayer({
                container: targetDomRef.value,
                // 素材视频链接
                src,
                // 素材配置json对象
                config,
                width,
                height,
                // 同素材生成工具中配置的保持一致
                fps,
                // 是否循环
                loop,
                // 是否对视频静音
                mute,
                // 起始播放时间点(单位秒),在一些浏览器中可能无效
                beginPoint,
                // 是否启用精准模式（使用requestVideoFrameCallback提升融合效果，浏览器不兼容时自动降级）
                accurate,
                //	是否预加载视频资源（默认关闭，即边下边播）
                precache,
                // 融合信息（图片/文字）,同素材生成工具生成的配置文件中的srcTag所对应，比如[imgUser] => imgUser
                imgUser,
                imgAnchor,
                textUser,
                textAnchor,
                // 组件基于type字段做了实例化缓存，不同的VAP实例应该使用不同的type值（如0、1、2等）
                type
            })

            if (useType === 1) {
                player.play()
            } else {
                // 注意：vap动效方案不支持初始播放设置，即播放器初始化就会开始播放中止不了，除非改源码
                lifeCycleEvent(player)
                emit('ready', { player })
            }

        }

        onMounted(() => {
            playerInit()
        })

        onUnmounted(() => {
            player.destroy();
            if (onDestory) onDestory(player);
        })

        return () => <div ref={ targetDomRef } > </div>
    }

})