import {Typography, Accordion, AccordionSummary, AccordionDetails} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {GetStaticProps} from 'next';
import {FaqModel} from '../../api/Faq';
import {openDB} from '../openDB';

interface FaqProps {
    faq: FaqModel[];
}

export default function Faq({faq}: FaqProps) {
    return (
        <div>
            {faq.map((question) => (
                <Accordion key={question.id}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>
                            {question.question}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            {question.answer}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    let faq = [];
    try {
        const db = await openDB();
        faq = await db.all('SELECT * FROM FAQ ORDER BY createDate DESC');
    } catch (e) {
        console.error("[FAQ] DB operation error" + e.stack);
    }
    return {props: {faq}};
};

