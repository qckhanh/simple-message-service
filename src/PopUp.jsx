import {BlurFade} from "@/components/magicui/blur-fade.js";

const BlurFadeTextDemo = () => {
    return (
        <section id="header">
            <BlurFade delay={0.5} inView>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    H
                </h2>
            </BlurFade>
            <BlurFade delay={0.5 * 2} inView>
        <span className="text-pretty text-xl tracking-tighter sm:text-3xl xl:text-4xl/none">
          Nice to meet you
        </span>
            </BlurFade>
        </section>
    );
}

export default BlurFadeTextDemo;
