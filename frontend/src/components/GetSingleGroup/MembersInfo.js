export default function MembersInfo({ group }) {
    // {id, username, firstName, lastName}
    return (
        <div>
            <h2 className="organizer-label-group">Members</h2>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
                {group.Memberships.filter(member => member.status !== "pending").map((member) => (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: "15px" }} key={member.id}>
                        <div style={{}}>
                            <img style={{ borderRadius: "9999px", backgroundColor: "inherit" }} height="60px" width="60px" src="https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg"></img>
                        </div>
                        <div>
                            <p>{member.firstName} {member.lastName}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
