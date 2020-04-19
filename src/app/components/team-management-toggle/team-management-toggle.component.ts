import { Component, OnInit, Input, Output } from "@angular/core";
import { User } from "../../services/user/user";
import * as Users from "../../services/user/user.service";
import { AwayTeamService } from '../../services/away-team/away-team.service';
import { AwayTeamMember } from "../../services/away-team/away-team-member";
/**
 * Allows for the administration of the away team by listing crew members
 * and away team members
 */
@Component({
    selector: 'app-team-management-toggle',
    templateUrl: './team-management-toggle.component.html',
    styleUrls: ['./team-management-toggle.component.css']
})
export class TeamManagementToggleComponent implements OnInit {
    private _awayTeam: Map<string, User>;
    private _crewMembers: Map<string, User>;
    teamManagementMenuOpen: boolean = false;

    // Initialization

    constructor(
        private userService: Users.UserService,
        private awayTeamService: AwayTeamService,
    ) { }

    ngOnInit() {
        this._crewMembers = new Map<string, User>(this.userService.users);
        this._crewMembers.delete(Users.KIRK);
        this._awayTeam = new Map<string, User>();

        this.awayTeamService.list()
            .subscribe(values => values.map((awayTeamMember: AwayTeamMember) => {
                this._awayTeam.set('' + awayTeamMember.id, this.userService.get('' + awayTeamMember.id));
                this._crewMembers.delete('' + awayTeamMember.id);
            }));

        this.awayTeamService.memberAdded$.subscribe();
        this.awayTeamService.memberRemoved$.subscribe();
    }

    toggleTeamManagementMenu() {
        return this.teamManagementMenuOpen = !this.teamManagementMenuOpen;
    }

    @Output()
    addMember(member: User) {
        this._awayTeam.set(member.id, member);
        this._crewMembers.delete(member.id);
        member.role = !member.isAdmin ? "Away Team" : "Starship Captain";
        this.awayTeamService.add(member).subscribe();
    }

    @Input()
    get awayTeam(): User[] {
        return Array.from(this._awayTeam.values())
            .filter(user => !user.isAdmin)
            .sort((a, b) => {
                return a.id > b.id ? 1 : -1;
            });
    }

    @Input()
    get crewMembers(): User[] {
        return Array.from(this._crewMembers.values())
            .filter(user => !user.isAdmin)
            .sort((a, b) => {
                return a.id > b.id ? 1 : -1;
            });
    }

    @Output()
    removeMember(member: User) {
        this._crewMembers.set(member.id, member);
        this._awayTeam.delete(member.id);
        member.role = !member.isAdmin ? "Starship Enterprise" : "Starship Captain";
        this.awayTeamService.remove(member).subscribe();
    }
}
