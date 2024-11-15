/*
 * @Author: Chris
 * @Date: 2023-08-29 10:01:01
 * @LastEditors: Chris
 * @LastEditTime: 2023-08-30 14:17:10
 * @FilePath: \PagTest\src\components\animationPlayer\AnimationPlayer.tsx
 * @Description: 
 * 
 * Copyright (c) 2023 by aiyiyun, All Rights Reserved. 
 */
import type { playerCommonType } from '@/types/animationPlayer'
import { defineAsyncComponent, defineComponent, h, resolveComponent } from 'vue'



const mapArray: Array<Array<RegExp | string>> = [
    [/\.pag/i, 'PagPlayer'],
    [/\.svga/i, 'SvgaPlayer'],
    [/\.mp4/i, 'VapPlayer'],
    [/\.json/i, 'LottiePlayer']
]

export default defineComponent({
    name: 'AnimationPlayer',
    props: {
        conf: {
            type: Object,
            require: true
        },
    },
    components: {
        PagPlayer: defineAsyncComponent(() => import('./PagPlayer')),
        SvgaPlayer: defineAsyncComponent(() => import('./SvgaPlayer')),
        VapPlayer: defineAsyncComponent(() => import('./VapPlayer')),
        LottiePlayer: defineAsyncComponent(() => import('./LottiePlayer'))
    },
    setup(props, { emit }) {
        const onReady = (player: { player: any }) => {
            emit('ready', player)
        }
        const { conf } = props;
        const { url, useType } = conf as playerCommonType;
        for (let i = 0; i < mapArray.length; i++) {
            if ((mapArray[i][0] as RegExp).test(url)) {
                // 根据用途传参props
                const propsParams = useType === 2 ? { conf } : { conf, onReady }
                return () => h(resolveComponent(mapArray[i][1] as string), propsParams)
            }
        }
        return () => <div>当前没有与该资源格式匹配的动画播放器~</div>
    }
})
