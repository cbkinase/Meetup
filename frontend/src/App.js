import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import GroupCollection from "./components/GetAllGroups";
import Homepage from "./components/Homepage";
import SingleGroup from "./components/GetSingleGroup";

function App() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
    }, [dispatch]);

    return (
        <>
            <Navigation isLoaded={isLoaded} />
            {isLoaded && (
                <Switch>
                    <Route exact path="/">
                        <Homepage></Homepage>
                    </Route>
                    <Route exact path="/groups">
                        <GroupCollection></GroupCollection>
                    </Route>
                    <Route exact path="/groups/:groupId">
                        <SingleGroup></SingleGroup>
                    </Route>
                    <Route path="/creategroup"></Route>
                </Switch>
            )}
        </>
    );
}

export default App;
