import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import GroupCollection from "./components/GetAllGroups";
import Homepage from "./components/Homepage";
import SingleGroup from "./components/GetSingleGroup";
import CreateGroupForm from "./components/CreateGroup";
import SingleEvent from "./components/GetSingleEvent";
import CreateEventForm from "./components/CreateEvent";

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
                    <Route exact path="/events">
                        <GroupCollection isEvents={true}></GroupCollection>
                    </Route>
                    <Route path="/groups/new">
                        <CreateGroupForm></CreateGroupForm>
                    </Route>
                    <Route exact path="/groups/:groupId/edit">
                        <CreateGroupForm isUpdating={true}></CreateGroupForm>
                    </Route>
                    <Route exact path="/groups/:groupId/events/new">
                        <CreateEventForm></CreateEventForm>
                    </Route>
                    <Route exact path="/groups/:groupId/events/:eventId/edit">
                        <CreateEventForm isUpdating={true}></CreateEventForm>
                    </Route>

                    <Route exact path="/groups/:groupId">
                        <SingleGroup></SingleGroup>
                    </Route>
                    <Route exact path="/events/:eventId">
                        <SingleEvent></SingleEvent>
                    </Route>
                </Switch>
            )}
        </>
    );
}

export default App;
