import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import GroupCollection from "./components/GetAllGroups";
import Homepage from "./components/Homepage";
import SingleGroup from "./components/GetSingleGroup";
import CreateGroupForm from "./components/CreateGroup";

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
                    <Route path="/groups/new">
                        <CreateGroupForm></CreateGroupForm>
                    </Route>
                    <Route exact path="/groups/:groupId/edit">
                        <CreateGroupForm isUpdating={true}></CreateGroupForm>
                    </Route>
                    <Route exact path="/groups/:groupId">
                        <SingleGroup></SingleGroup>
                    </Route>
                </Switch>
            )}
        </>
    );
}

export default App;
