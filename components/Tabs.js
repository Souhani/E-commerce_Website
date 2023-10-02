import styled from "styled-components"

const StyledTabs = styled.div`
   display: flex;
   gap: 20px;
   font-size: 1.5rem;
   margin-bottom: 20px;
`;
const Tab = styled.span`
  ${props => props.active ? `
   color: #000;
   border-bottom: 2px solid #000;
  `:`
   color: #999;
   cursor: pointer;
  `}
`;
export default function Tabs({tabs, activeTab, onChange}) {
    return(
        <StyledTabs>
           {tabs.map(tabName => (
            <Tab active={activeTab===tabName}
                 onClick={() => onChange(tabName)}>{tabName}</Tab>
           ))}
        </StyledTabs>
    )
}