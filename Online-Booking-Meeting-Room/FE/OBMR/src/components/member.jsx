import React from 'react';
import Select from 'react-select';
import "../styles/member.css";
export default class Members extends React.Component {
    constructor() {
        super();

        this.state = {
            members: [],
            selectedOption: null, // Lựa chọn hiện tại từ react-select
        };

        this.options = [
            { label: 'Turkey', value: 'Turkey' },
            { label: 'Ebert', value: 'Ebert' },
            { label: 'Sam', value: 'Sam' },
            { label: 'Samantha', value: 'Samantha' },
            { label: 'Katrina', value: 'Katrina' },
            { label: 'Rosemary', value: 'Rosemary' },
        ];
    }

    addMember = () => {
        const { selectedOption, members } = this.state;
        if (selectedOption && !members.includes(selectedOption.label)) {
            this.setState({
                members: [...members, selectedOption.label],
                selectedOption: null, // Reset react-select
            });
        }
    };

    removeMember = (index) => {
        const { members } = this.state;
        members.splice(index, 1);
        this.setState({ members });
    };

    handleSelectChange = (selectedOption) => {
        this.setState({ selectedOption });
    };

    render() {
        const { members, selectedOption } = this.state;

        return (
            <div>
                <div className="input-container d-flex align-items-center ">
                    <Select
                        options={this.options}
                        value={selectedOption}
                        onChange={this.handleSelectChange}
                        placeholder="Select a member"
                        className="flex-grow-1 me-2"
                    />
                    <button
                        className="btn "
                        onClick={this.addMember}
                        disabled={!selectedOption}
                    >
                        Add Member
                    </button>
                </div>

                {/* Danh sách hiển thị ngang */}
                <div id="members-box" className="horizontal-scroll">
                    {members.map((member, index) => (
                        <div
                            key={index}
                            className="member-item d-flex align-items-center"
                        >
                            <span className="me-2">{member}</span>
                            <i className="fa-solid fa-xmark" onClick={() => this.removeMember(index)}></i>


                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
