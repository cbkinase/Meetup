import "./ManageMembers.css";
import { getGroupInfo } from "../../store/groups";
import { useDispatch } from "react-redux";
import { csrfFetch } from "../../store/csrf";
import { useState } from "react";

export default function ManageMembers({ group, user }) {
    const dispatch = useDispatch();
    const [mems, setMems] = useState(group.Memberships);
    const pendingMembers = mems.filter(member => member.status === "pending");
    const otherMembers = mems.filter(member => member.status !== "pending"
        // && member.id !== user.id
    );

    const placeholderUrl = "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg";

    async function handleAcceptMember(memberId, group) {
        const res = await csrfFetch(`/api/groups/${group.id}/membership`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ memberId: memberId, status: "member" }),
        })
        const data = await res.json();
        const info = await dispatch(getGroupInfo(group.id));
        setMems(info.Memberships);

    }

    async function handleRemoveMember(memberId, group) {
        const res = await csrfFetch(`/api/groups/${group.id}/membership`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ memberId: memberId }),
        })

        const data = await res.json();
        const info = await dispatch(getGroupInfo(group.id));
        setMems(info.Memberships);
    }

    return (
        <div className="manage-container">
            <div className="section-heading">Manage Memberships</div>
            <div className="section-subheading">Members</div>
            <div className="member-list">
                {otherMembers.map(member => (
                    <div key={member.id} className="member-card">
                        <img className="member-avatar" src={placeholderUrl} alt="Member Avatar" />
                        <div className="member-details">
                            <div className="member-name">{member.firstName} {member.lastName}</div>
                        </div>
                        <button onClick={e => handleRemoveMember(member.id, group)} style={{ display: user.id === member.id ? 'none' : 'inline-block' }} className="remove-button">Remove</button>
                    </div>
                ))}
            </div>
            <div className="section-subheading">Pending Members</div>
            <div className="member-list">
                {pendingMembers.map(member => (
                    <div key={member.id} className="member-card">
                        <img className="member-avatar" src={placeholderUrl} alt="Member Avatar" />
                        <div className="member-details">
                            <div className="member-name">{member.firstName} {member.lastName}</div>
                        </div>
                        <button onClick={e => handleRemoveMember(member.id, group)} className="remove-button">Decline</button>
                        <button onClick={e => handleAcceptMember(member.id, group)} className="accept-button">Accept</button>
                    </div>
                ))}
            </div>
        </div>
    )
}
