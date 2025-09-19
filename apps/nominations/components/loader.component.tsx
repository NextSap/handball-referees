import React from 'react';
import {Spinner} from "@workspace/ui/components/spinner";

const LoaderComponent = () => {
    return (
        <div className="h-[100vh] flex flex-col gap-3 justify-center items-center">
            <p>Data are loading...</p>
            <Spinner variant={"circle"}/>
        </div>
    );
};

export default LoaderComponent;