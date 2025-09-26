import React from 'react';
import {Spinner} from "@workspace/ui/components/spinner";
import translate from "../public/translate.json";
import {LangType} from "@/services/storage.service";

type LoaderProps = {
    lang: LangType
 }

const LoaderComponent = (props: LoaderProps) => {
    const text = translate[props.lang]
    return (
        <div className="h-[100vh] flex flex-col gap-3 justify-center items-center">
            <p>{text.loading}</p>
            <Spinner variant={"circle"}/>
        </div>
    );
};

export default LoaderComponent;