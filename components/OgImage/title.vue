<script setup>
const { title, image, description, link } = defineProps({
    title: String,
    image: String,
    description: String,
    link: String,
});
let parseText = function (text, limit) {
    if (text.length > limit) {
        for (let i = limit; i > 0; i--) {
            if (
                text.charAt(i) === " " &&
                (text.charAt(i - 1) != "," ||
                    text.charAt(i - 1) != "." ||
                    text.charAt(i - 1) != ";")
            ) {
                return text.substring(0, i) + "...";
            }
        }
        return text.substring(0, limit) + "...";
    } else return text;
};

let descriptionTrunc = parseText(description, 250);
</script>

<template>
    <div
        class="w-full h-full flex flex-row justify-center bg-[#212121] p-[50px]"
    >
        <svg
            class="absolute top-0 right-0"
            width="1200"
            height="675"
            viewBox="0 0 1200 675"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g
                style="mix-blend-mode: overlay"
                opacity="0.7"
                filter="url(#filter0_f_448_25)"
            >
                <circle cx="901.5" cy="45.5" r="199.5" fill="#FFA7A7" />
                <circle cx="600.5" cy="216.5" r="199.5" fill="#FFCC49" />
                <circle cx="179.5" cy="317.5" r="199.5" fill="#FFA149" />
            </g>
            <defs>
                <filter
                    id="filter0_f_448_25"
                    x="-240"
                    y="-374"
                    width="1561"
                    height="1111"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feGaussianBlur
                        stdDeviation="110"
                        result="effect1_foregroundBlur_448_25"
                    />
                </filter>
            </defs>
        </svg>

        <div class="w-[700px] pl-[50px]">
            <p class="uppercase text-[24px] text-[#FEC476] mb-4 font-semibold">
                {{ link }}
            </p>
            <h1
                class="w-[600px] m-0 text-[75px] font-semibold mb-auto text-white flex items-center"
            >
                <span>{{ title }}</span>
            </h1>
            <p class="text-[32px] text-[#E4E4E7] leading-tight">
                {{ descriptionTrunc }}
            </p>
        </div>
        <img
            :src="image"
            alt="Og Image"
            class="h-[500px] ml-auto object-cover rounded-[12px]"
        />
    </div>
</template>
